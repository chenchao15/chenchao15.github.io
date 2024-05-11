from pygltflib import GLTF2, Scene, Node, Mesh, Primitive, Buffer, BufferView, Accessor, Image, TextureInfo, Texture, Material
from pywavefront import Wavefront
import trimesh
import numpy as np
import os

def load_obj(filename):
    scene = Wavefront(filename, create_materials=True, collect_faces=True)
    vertices = []
    normals = []
    texcoords = []
    indices = []

    # Gather data from pywavefront's structure
    for mesh in scene.mesh_list:
        for face in mesh.faces:
            for vert_idx in face:
                vertices.extend(scene.vertices[vert_idx])
                if mesh.materials:
                    material = mesh.materials[0]
                    if 'vn' in material.vertex_format:
                        normals.extend(scene.normals[vert_idx])
                    if 'vt' in material.vertex_format:
                        texcoords.extend(scene.texcoords[vert_idx])
            indices.extend(face)

    return np.array(vertices, dtype=np.float32).reshape(-1, 3), \
           np.array(normals, dtype=np.float32).reshape(-1, 3), \
           np.array(texcoords, dtype=np.float32).reshape(-1, 2), \
           np.array(indices, dtype=np.uint32)

def create_glb(vertices, normals, texcoords, indices, filename="output.glb"):
    gltf = GLTF2()

    # Create buffers
    buffer = Buffer()
    vertex_buffer_data = vertices.tobytes() + normals.tobytes() + texcoords.tobytes()
    buffer.byteLength = len(vertex_buffer_data)
    gltf.buffers.append(buffer)

    # Create buffer views
    vertex_buffer_view = BufferView(buffer=0, byteOffset=0, byteLength=len(vertices.tobytes()), target=34962)
    normal_buffer_view = BufferView(buffer=0, byteOffset=len(vertices.tobytes()), byteLength=len(normals.tobytes()), target=34962)
    texcoord_buffer_view = BufferView(buffer=0, byteOffset=len(vertices.tobytes()) + len(normals.tobytes()), byteLength=len(texcoords.tobytes()), target=34962)
    index_buffer_view = BufferView(buffer=0, byteOffset=len(vertex_buffer_data), byteLength=len(indices.tobytes()), target=34963)
    gltf.bufferViews.extend([vertex_buffer_view, normal_buffer_view, texcoord_buffer_view, index_buffer_view])

    # Create accessors
    vertex_accessor = Accessor(bufferView=0, componentType=5126, count=len(vertices), type="VEC3", byteOffset=0)
    normal_accessor = Accessor(bufferView=1, componentType=5126, count=len(normals), type="VEC3", byteOffset=0)
    texcoord_accessor = Accessor(bufferView=2, componentType=5126, count=len(texcoords), type="VEC2", byteOffset=0)
    index_accessor = Accessor(bufferView=3, componentType=5125, count=len(indices), type="SCALAR", byteOffset=0)
    gltf.accessors.extend([vertex_accessor, normal_accessor, texcoord_accessor, index_accessor])

    # Create a mesh primitive
    primitive = Primitive(attributes={"POSITION": 0, "NORMAL": 1, "TEXCOORD_0": 2}, indices=3)
    mesh = Mesh(primitives=[primitive])
    node = Node(mesh=0)
    scene = Scene(nodes=[0])
    gltf.meshes.append(mesh)
    gltf.nodes.append(node)
    gltf.scenes.append(scene)
    gltf.scene = 0

    # Save to GLB
    gltf.save_binary(filename)

path = 'lpi'
names = os.listdir(path)
for name in names:
    if '.glb' in name:
        continue
    temp = os.path.join(path, name)
    mesh = trimesh.load(temp)
    mesh.export(temp.split('.')[0] + '.glb')
