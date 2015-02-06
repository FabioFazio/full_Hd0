<?php
namespace Test\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

/** 
 * @ORM\Entity
 * @ORM\Table(name="UserGroup")
 */
class Group {
    /**
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 * @ORM\Column(type="integer")
	 */
	protected $id;

	/** @ORM\Column(type="string", length=255) */
	protected $name;
	
	/** @ORM\ManyToMany(targetEntity="Grant") */
	protected $grants;

	public function __construct(){
		$this->grants = new ArrayCollection();
	}
	
	public function getId(){
	    return $this->id;
	}
    
    public function setId($id){
    	$this->id = $id;
    }
    
    public function getName(){
    	return $this->name;
    }
    
    public function setName($name){
    	$this->name = $name;
    }

    public function getGrants(){
    	return $this->grants;
    }
    
    public function setGrants($grants){
    	$this->grants = $grants;
    }
}