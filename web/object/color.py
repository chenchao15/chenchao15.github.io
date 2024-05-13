import numpy as np
import open3d as o3d
import os
import sys
import trimesh

def create_sphere_at_xyz(xyz, colors=None, size=0.005):
    sphere = o3d.geometry.TriangleMesh.create_sphere(radius=size, resolution=5)
    #sphere.compute_vertex_normals()
    if colors is None:
        sphere.paint_uniform_color([0.7, 0.1, 0.1]) #To be changed to the point color.
        # sphere.paint_uniform_color([0.0, 0.0, 1.0])
    else:
        sphere.paint_uniform_color(colors)
    sphere = sphere.translate(xyz)
    # o3d.visualization.draw_geometries([sphere], window_name="Open3D2")
    return sphere


def generate_mesh(points,colors,filename,size=0.005):

    # mesh = o3d.io.read_triangle_mesh('occn_sphere_50001eeee2.off')
    # mesh.paint_uniform_color([0.7, 0.7, 0.7])
    colors = np.asarray(colors)
    if len(colors.shape) == 1:
        colors = np.tile(colors[None, :], [points.shape[0], 1])
    mesh = create_sphere_at_xyz(points[0], colors=colors[0], size=size)
    for i in range(points.shape[0]):
        mesh += create_sphere_at_xyz(points[i], colors=colors[i], size=size)
    # o3d.visualization.draw_geometries([mesh], window_name="Open3D2")
    o3d.io.write_triangle_mesh(filename, mesh)
    return mesh


dirs = ['lpi']
for d in dirs:
    names = os.listdir(os.path.join(d, 'othercase'))
    othernames = os.listdir(d)
    allnames = []
    for n in names:
        if '.glb' in n or '.' not in n:
            continue
        allnames.append(os.path.join(d, 'othercase', n))
    for n in othernames:
        if '.glb' in n or '.' not in n:
            continue
        allnames.append(os.path.join(d, n))
          
    for name in allnames:
        print(name)
        mesh = o3d.io.read_triangle_mesh(name)
        if not '_local' in name:
            mesh.paint_uniform_color([0, 0.7, 0.7])
        outname = name.split('.')[0] + '.glb'
        o3d.io.write_triangle_mesh(outname, mesh)

        
